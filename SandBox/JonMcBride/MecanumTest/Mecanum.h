/*
  Mecanum.h - Library for controlling mecanum wheels
*/

#ifndef __Mecanum_H__
#define __Mecanum_H__

#include <Arduino.h>
#include "IMotionController.h"
#include "MotionStatus.h"
#include "IRhinoMotorController.h"

class Mecanum : IMotionController
{
  public:
    virtual void Attach(IRhinoMotorController MA, IRhinoMotorController MB, IRhinoMotorController MC, IRhinoMotorController MD);
    virtual bool Move(Vector translation, Vector rotation);
    virtual bool IsClear(Vector vector);
    //virtual MotionStatus GetStatus();
    
  private:
    IRhinoMotorController MA;
    IRhinoMotorController MB;
    IRhinoMotorController MC;
    IRhinoMotorController MD;
};

#endif
