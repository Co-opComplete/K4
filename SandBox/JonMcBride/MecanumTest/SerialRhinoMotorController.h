/*
  RhinoMotorControllerUart.h - Serial implementation for controlling a Rhino Motor
*/

#ifndef __SerialController_H__
#define __SerialController_H__

#include <Arduino.h>
//#include <HardwareSerial.h>
#include <SoftwareSerial.h>
#include "IMotorController.h"
#include "I2cRhinoMotorController.h"

class SerialController : public IMotorController
{
  private:
    //HardwareSerial& _port = Serial;
    SoftwareSerial *_port;
    
    int ConvertValue(float value)
    {
      value = min(-1.0f, max(value, 1.0f)); // Force value within acceptable range [-1.0f, 1.0f]
      return value * 255;
    }
    
    float ConvertValue(int value)
    {
      return value / 255;
    }
    
  public:
    SerialController();
    
    //void Attach(HardwareSerial& port, int baud);
    void Attach(int rxPin, int txPin, int baud);
    
    virtual void WriteMaxSpeed(float value);
    virtual void WriteSpeed(float value);
    virtual void WriteDamping(float value);
    virtual void WriteRelativePosition(long value);
    
    virtual float ReadSpeed();
    virtual float ReadMaxSpeed();
    virtual float ReadDamping();
    virtual long ReadPosition();
    
    bool RestoreDefaults();
    bool WriteI2cAddress(int address);
};

#endif /* __SerialController_H__ */
