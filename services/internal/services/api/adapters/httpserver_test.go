package adapters

import (
	"encoding/json"
	"io"
	"log/slog"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/wluisw/ai-first-demo/services/internal/services/api/domain"
)

// stubGreeter 是测试用的入站端口桩,避免 adapters ↔ app 循环依赖。
type stubGreeter struct{}

func (stubGreeter) Greet(name string) domain.Greeting { return domain.NewGreeting(name) }

func newTestHandler() http.Handler {
	return NewHTTPHandler(stubGreeter{}, slog.New(slog.NewJSONHandler(io.Discard, nil)))
}

func TestHealthz(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/healthz", nil)
	rec := httptest.NewRecorder()
	newTestHandler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("healthz status = %d, want 200", rec.Code)
	}
}

func TestHelloDefaultsToWorld(t *testing.T) {
	req := httptest.NewRequest(http.MethodGet, "/api/hello", nil)
	rec := httptest.NewRecorder()
	newTestHandler().ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("hello status = %d, want 200", rec.Code)
	}
	var body struct {
		Message string `json:"message"`
	}
	if err := json.Unmarshal(rec.Body.Bytes(), &body); err != nil {
		t.Fatalf("decode body: %v", err)
	}
	if body.Message != "hello, world" {
		t.Fatalf("message = %q, want %q", body.Message, "hello, world")
	}
}
