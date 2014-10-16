/*
  FakeMotorController.h - A fake motor for debug purposes
*/

#ifndef __I2cController_H__
#define __I2cController_H__

#include <Arduino.h>
#include "IMotorController.h"

class FakeMotorController : public IMotorController
{
  private:
    String motorName;
  public:
    FakeMotorController(String motorName);
    
    virtual void WriteMaxSpeed(float value);
    virtual void WriteSpeed(float value);
    virtual void WriteDamping(float value);
    virtual void WriteRelativePosition(long value);
    
    virtual float ReadSpeed();
    virtual float ReadMaxSpeed();
    virtual float ReadDamping();
    virtual long ReadPosition();

};


#endif
