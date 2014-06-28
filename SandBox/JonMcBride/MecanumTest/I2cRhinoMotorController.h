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
    I2cController();
    
    void Attach(int address);
    
    virtual void WriteMaxSpeed(float value);
    virtual void WriteSpeed(float value);
    virtual void WriteDamping(float value);
    virtual void WriteRelativePosition(long value);
    
    virtual float ReadSpeed();
    virtual float ReadMaxSpeed();
    virtual float ReadDamping();
    virtual long ReadPosition();
};

#endif /* __I2cController_H__ */
