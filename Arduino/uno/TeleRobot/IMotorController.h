/*
  IRhinoMotorController.h - Interface for controlling Rhino Motors
*/

#ifndef __IMotorController_H__
#define __IMotorController_H__

#include <Arduino.h>

class IMotorController
{    
  public:
    virtual void SetMaxSpeed(float value) = 0;
    virtual void SetSpeed(float value) = 0;
    virtual void SetDamping(float value) = 0;
    virtual void SetRelativePosition(long value) = 0;
    
    virtual float ReadSpeed() = 0;
    virtual float ReadMaxSpeed() = 0;
    virtual float ReadDamping() = 0;
    virtual long  ReadPosition() = 0;
};


#endif /* __IMotorController_H__ */
