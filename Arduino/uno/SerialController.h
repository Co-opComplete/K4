/*
  SerialController.h - Serial implementation for controlling a Rhino Motor
*/

#ifndef __SerialController_H__
#define __SerialController_H__

#include <Arduino.h>
#include <SoftwareSerial.h>
#include "IMotorController.h"
#include "I2cController.h"

class SerialController : public IMotorController
{
  private:
    SoftwareSerial *_port;
    String EOT;
    
    int ConvertValue(float value)
    {
      value = max(-1.0f, min(value, 1.0f)); // Force value within acceptable range [-1.0f, 1.0f]
      return value * 255;
    }
    
    float ConvertValue(int value)
    {
      return value / 255;
    }
    
  public:
    SerialController();
    
    void Attach(int rxPin, int txPin, int baud);
    
    virtual void SetMaxSpeed(float value);
    virtual void SetSpeed(float value);
    virtual void SetDamping(float value);
    virtual void SetRelativePosition(long value);
    
    virtual float ReadSpeed();
    virtual float ReadMaxSpeed();
    virtual float ReadDamping();
    virtual long  ReadPosition();
    
    bool RestoreDefaults();
    bool SetI2cAddress(int address);
    void SerialDump();
};

#endif /* __SerialController_H__ */
