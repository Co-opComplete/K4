/*
  IMotionController.h - Library for controlling mecanum wheels
*/

#ifndef __IMotionController_H__
#define __IMotionController_H__

#include <Arduino.h>
#include "Status.h"
#include "Vector.h"

class IDrive
{
  public:
    virtual void Configure(float maxSpeed, float damping) = 0;
    virtual bool Move(Vector translation, float rotation) = 0;
    virtual bool IsClear(Vector vector) = 0;
//    virtual MotionStatus GetStatus();
};

#endif
