/*
  Mecanum.h - Library for controlling mecanum wheels
*/

#ifndef __Mecanum_H__
#define __Mecanum_H__

#include <Arduino.h>
#include "IMotionController.h"
#include "MotionStatus.h"
#include "IMotorController.h"

class Mecanum : public IMotionController
{
  private:
    IMotorController *MA;
    IMotorController *MB;
    IMotorController *MC;
    IMotorController *MD;
    
  public:
    virtual void Attach(IMotorController *MA, IMotorController *MB, IMotorController *MC, IMotorController *MD);
    virtual bool Move(Vector translation, float rotation);
    virtual bool IsClear(Vector vector);
    //virtual MotionStatus GetStatus();
};

#endif
