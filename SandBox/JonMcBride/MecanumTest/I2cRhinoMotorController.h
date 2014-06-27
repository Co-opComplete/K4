/*
  RhinoMotorControllerI2C.cpp - I2C implementation for controlling a Rhino Motor
*/

#ifndef __I2cController_H__
#define __I2cController_H__

#include <Arduino.h>
#include "IRhinoMotorController.h"

class I2cController : public IRhinoMotorController
{
  private:
    int i2cAddress;
    
  public:
    I2cController();
    
    void Attach(int address);
    
    virtual void WriteMaxSpeed(int value);
    virtual void WriteSpeed(int value);
    virtual void WriteDamping(int value);
    virtual void WriteRelativePosition(long value);
    
    virtual int ReadSpeed();
    virtual int ReadMaxSpeed();
    virtual int ReadDamping();
    virtual long ReadPosition();
};

#endif /* __I2cController_H__ */
