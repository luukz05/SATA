#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "Granada";
const char* password = "XULEZENTO10";
const char* serverName = "https://e5bf-2804-1b1-fa00-f190-2d24-ccc7-3f7e-f1f0.ngrok-free.app/";

void setup() {
  Serial.begin(115200);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) delay(500);

  HTTPClient http;
  http.begin(serverName);
  http.addHeader("Content-Type", "application/json");

  int httpResponseCode = http.POST("{\"mensagem\":\"Risco de enchente detectado!\"}");
  Serial.println(httpResponseCode);
  http.end();
}

void loop() {}
