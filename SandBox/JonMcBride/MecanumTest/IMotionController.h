/*
  IMotionController.h - Library for controlling mecanum wheels
*/

#ifndef __IMotionController_H__
#define __IMotionController_H__

#include <Arduino.h>
#include "MotionStatus.h"
#include "Vector.h"

class IMotionController
{
  public:
    virtual bool Move(Vector translation, float rotation) = 0;
    virtual bool IsClear(Vector vector) = 0;
//    virtual MotionStatus GetStatus();
};

#endif
