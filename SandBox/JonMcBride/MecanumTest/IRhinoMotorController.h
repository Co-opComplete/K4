/*
  IRhinoMotorController.h - Interface for controlling Rhino Motors
*/

#ifndef __IRhinoMotorController_H__
#define __IRhinoMotorController_H__

#include <Arduino.h>

class IRhinoMotorController
{    
  public:
    virtual void WriteMaxSpeed(int value) {};
    virtual void WriteSpeed(int value) {};
    virtual void WriteDamping(int value) {};
    virtual void WriteRelativePosition(long value) {};
    
    virtual int ReadSpeed() {};
    virtual int ReadMaxSpeed() {};
    virtual int ReadDamping() {};
    virtual long ReadPosition() {};
};


#endif /* __IRhinoMotorController_H__ */
