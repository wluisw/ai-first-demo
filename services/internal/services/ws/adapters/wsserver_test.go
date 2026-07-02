package adapters

import (
	"context"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/coder/websocket"

	"github.com/wluisw/ai-first-demo/services/internal/services/ws/domain"
)

// stubEchoer 是测试用的入站端口桩,避免 adapters ↔ app 循环依赖。
type stubEchoer struct{}

func (stubEchoer) Echo(msg string) string { return domain.Echo(msg) }

func newTestServer() *httptest.Server {
	h := NewHTTPHandler(stubEchoer{}, slog.New(slog.NewJSONHandler(io.Discard, nil)))
	return httptest.NewServer(h)
}

func TestWSHealthz(t *testing.T) {
	srv := newTestServer()
	defer srv.Close()

	resp, err := http.Get(srv.URL + "/healthz")
	if err != nil {
		t.Fatalf("healthz get: %v", err)
	}
	defer resp.Body.Close()
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("healthz status = %d, want 200", resp.StatusCode)
	}
}

func TestWSEcho(t *testing.T) {
	srv := newTestServer()
	defer srv.Close()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	wsURL := "ws" + srv.URL[len("http"):] + "/ws"
	c, _, err := websocket.Dial(ctx, wsURL, nil)
	if err != nil {
		t.Fatalf("dial: %v", err)
	}
	defer c.CloseNow()

	if err := c.Write(ctx, websocket.MessageText, []byte("ping")); err != nil {
		t.Fatalf("write: %v", err)
	}
	_, data, err := c.Read(ctx)
	if err != nil {
		t.Fatalf("read: %v", err)
	}
	if string(data) != "echo: ping" {
		t.Fatalf("reply = %q, want %q", data, "echo: ping")
	}
}
