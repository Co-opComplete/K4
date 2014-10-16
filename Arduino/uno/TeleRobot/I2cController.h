/*
  RhinoMotorControllerI2C.cpp - I2C implementation for controlling a Rhino Motor
*/

#ifndef __I2cController_H__
#define __I2cController_H__

#include <Arduino.h>
#include "IMotorController.h"

class I2cController : public IMotorController
{
  private:
    int i2cAddress;
    
    int ConvertValue(float value);
    float ConvertValue(int value);
    
  public:
    I2cController();
    
    void Attach(int address);
    
    virtual void SetMaxSpeed(float value);
    virtual void SetSpeed(float value);
    virtual void SetDamping(float value);
    virtual void SetRelativePosition(long value);
    
    virtual float ReadSpeed();
    virtual float ReadMaxSpeed();
    virtual float ReadDamping();
    virtual long  ReadPosition();
};

#endif /* __I2cController_H__ */
