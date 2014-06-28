/*
  IRhinoMotorController.h - Interface for controlling Rhino Motors
*/

#ifndef __IRhinoMotorController_H__
#define __IRhinoMotorController_H__

#include <Arduino.h>

class IMotorController
{    
  public:
    virtual void WriteMaxSpeed(float value) = 0;
    virtual void WriteSpeed(float value) = 0;
    virtual void WriteDamping(float value) = 0;
    virtual void WriteRelativePosition(long value) = 0;
    
    virtual float ReadSpeed() = 0;
    virtual float ReadMaxSpeed() = 0;
    virtual float ReadDamping() = 0;
    virtual long ReadPosition() = 0;
};


#endif /* __IRhinoMotorController_H__ */
