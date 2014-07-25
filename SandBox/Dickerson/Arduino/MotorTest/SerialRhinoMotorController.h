/*
  RhinoMotorControllerUart.h - Serial implementation for controlling a Rhino Motor
*/

#ifndef __SerialController_H__
#define __SerialController_H__

#include <Arduino.h>
//#include <HardwareSerial.h>
#include <SoftwareSerial.h>
#include "IRhinoMotorController.h"
#include "I2cRhinoMotorController.h"

class SerialController : public IRhinoMotorController
{
  private:
    //HardwareSerial& _port = Serial;
    SoftwareSerial *_port;
    
  public:
    SerialController();
    
    //void Attach(HardwareSerial& port, int baud);
    void Attach(int rxPin, int txPin, int baud);
    
    virtual void WriteMaxSpeed(int value);
    virtual void WriteSpeed(int value);
    virtual void WriteDamping(int value);
    virtual void WriteRelativePosition(long value);
    
    virtual int ReadSpeed();
    virtual int ReadMaxSpeed();
    virtual int ReadDamping();
    virtual long ReadPosition();
    
    bool RestoreDefaults();
    bool WriteI2cAddress(int address);
};

#endif /* __SerialController_H__ */
