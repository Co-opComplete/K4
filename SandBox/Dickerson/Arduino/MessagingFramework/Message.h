#ifndef __MESSAGE_H__
#define __MESSAGE_H__

#include <Arduino.h>
#include <StandardCplusplus.h>  // https://github.com/maniacbug/StandardCplusplus
#include <system_configuration.h>
#include <unwind-cxx.h>
#include <utility.h>
#include <vector>
#include <stdint.h>

#define HELP          00 // OMG WAKE UP EVERYONE! ROBOT IS ON FIRE!!!
#define ALERT         01 // Minor problems, request help from office coworkers
#define STATUS        02 // General status
#define SLEEP         03 // Enter low power usage mode
#define WAKE          04 // Enter normal mode
#define BATTERY       05 // Battery cell count and voltage levels
#define SONAR         06 // Sonar ID and distance to obstructions in inches
#define COMPASS       07
#define ACCELEROMETER 08
#define IR            09 // Reserved for future use
#define MOVE          10 // Translation, Rotation, and Camera Tilt

using namespace std;

class Message
{
  public:
    Message(uint16_t header, uint8_t len, void* data);
    ~Message();
    
    uint16_t header;
    uint8_t  len;
    void*    data;
};

class Envelope
{
  public:
    Envelope(uint16_t header);
    ~Envelope();
    
    void     add(Message* message);
    int      toByteArray(byte** destination);
    
    uint16_t         header;
    uint8_t          len;
    vector<Message*> messages;
    uint8_t          crc;
};

#endif /*__MESSAGE_H__*/
