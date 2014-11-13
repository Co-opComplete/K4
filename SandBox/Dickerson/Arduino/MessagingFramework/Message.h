#ifndef __MESSAGE_H__
#define __MESSAGE_H__

#include <Arduino.h>
#include <StandardCplusplus.h>  // https://github.com/maniacbug/StandardCplusplus
#include <system_configuration.h>
#include <unwind-cxx.h>
#include <utility.h>
#include <vector>
#include <stdint.h>

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
