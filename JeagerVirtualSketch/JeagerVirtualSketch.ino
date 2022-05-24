#include <Arduino.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;
SocketIOclient socketIO;

#define USE_SERIAL Serial

char* HOST_SOCKET = "animalgeek.sytes.net";
int PORT_SOCKET = 10019;
char* PARAMS_SOCKET = "/socket.io/?EIO=4";
char* SSID_WIFI = "Amorcitos";
char* PASS_WIFI = "4m0rc1t05";

String action_id = "";
#define DER 5 //Verde
#define IZQ 4 //Naranja

//------------- SOCKET CONTROL ----------------------------------------
void socketIOEvent(socketIOmessageType_t type, uint8_t* payload, size_t length) {
  StaticJsonDocument<1024> dd;
  String str = "";

  switch (type) {
    case sIOtype_DISCONNECT:
      USE_SERIAL.printf("[IOc] Disconnected!\n");
      break;
    case sIOtype_CONNECT:
      USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);

      // join default namespace (no auto join in Socket.IO V3)
      socketIO.send(sIOtype_CONNECT, "/");
      break;
    case sIOtype_EVENT:
      USE_SERIAL.printf("[IOc] get event: %s\n", payload);
      str = (char*)payload;
      action_id = str.substring(11, 12);

      USE_SERIAL.print(action_id);
      break;
    case sIOtype_ACK:
      USE_SERIAL.printf("[IOc] get ack: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_ERROR:
      USE_SERIAL.printf("[IOc] get error: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_BINARY_EVENT:
      USE_SERIAL.printf("[IOc] get binary: %u\n", length);
      hexdump(payload, length);
      break;
    case sIOtype_BINARY_ACK:
      USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
      hexdump(payload, length);
      break;
  }
}

//------------- SETUP ----------------------------------------
void setup() {
  // USE_SERIAL.begin(921600);
  USE_SERIAL.begin(115200);

  //Serial.setDebugOutput(true);
  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  for (uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  // disable AP
  if (WiFi.getMode() & WIFI_AP) {
    WiFi.softAPdisconnect(true);
  }

  WiFiMulti.addAP(SSID_WIFI, PASS_WIFI);

  //WiFi.disconnect();
  while (WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  String ip = WiFi.localIP().toString();
  USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

  // server address, port and URL
  socketIO.begin(HOST_SOCKET, PORT_SOCKET, PARAMS_SOCKET);

  // event handler
  socketIO.onEvent(socketIOEvent);

  pinMode(DER, OUTPUT);
  pinMode(IZQ, OUTPUT);
}

//------------- LOOP ----------------------------------------
void loop() {
  translate_action();
  socketIO.loop();

  //    uint64_t now = millis();

  //    if(now - messageTimestamp > 2000) {
  //        messageTimestamp = now;
  //
  //        // creat JSON message for Socket.IO (event)
  //        DynamicJsonDocument doc(1024);
  //        JsonArray array = doc.to<JsonArray>();
  //
  //        // add evnet name
  //        // Hint: socket.on('event_name', ....
  //        array.add("jeager");
  //
  //        // add payload (parameters) for the event
  //        JsonObject param1 = array.createNestedObject();
  //        param1["now"] = (uint32_t) now;
  //
  //        // JSON to String (serializion)
  //        String output;
  //        serializeJson(doc, output);
  //
  //        // Send event
  //        socketIO.sendEVENT(output);
  //
  //        // Print JSON for debugging
  //        USE_SERIAL.println(output);
  //    }
}

//Socket commands
//1 -> Izq
//3 -> Der
//2 -> Avanzar
//9 -> PARAR

//------------- ACTION ----------------------------------------
unsigned long messageTimestamp = 0;
uint64_t now = millis();

void translate_action() {
  now = millis();

  if (action_id == "1") {
    left_action();
  } else if (action_id == "3") {
    rigth_action();
  } else if (action_id == "2") {
    start_action();
  } else if (action_id == "9") {
    stop_action();
  } else {
    messageTimestamp = now;
    digitalWrite(DER, LOW);
    digitalWrite(IZQ, LOW);
  }
}

void left_action() {
  Serial.println("LEFT!");

  if (now - messageTimestamp > 500) {
    messageTimestamp = now;
    digitalWrite(IZQ, HIGH);
  } else if (now - messageTimestamp > 100) {
    digitalWrite(IZQ, LOW);
  }
}

void rigth_action() {
  Serial.println("RIGTH!");

  if (now - messageTimestamp > 500) {
    messageTimestamp = now;
    digitalWrite(DER, HIGH);
  } else if (now - messageTimestamp > 100) {
    digitalWrite(DER, LOW);
  }
}

void stop_action() {
  Serial.println("STOP!");

  if (now - messageTimestamp > 2000) {
    digitalWrite(DER, LOW);
    digitalWrite(IZQ, LOW);
  } else if (now - messageTimestamp > 500) {
    digitalWrite(DER, HIGH);
    digitalWrite(IZQ, HIGH);
  }
}

void start_action() {
  Serial.println("START!");

  if (now - messageTimestamp > 1000) {
    messageTimestamp = now;
    digitalWrite(DER, HIGH);
    digitalWrite(IZQ, HIGH);
  } else if (now - messageTimestamp > 100) {
    digitalWrite(DER, LOW);
    digitalWrite(IZQ, LOW);
  }
}
