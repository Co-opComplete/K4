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
    virtual bool Move(Vector translation, Vector rotation);
    virtual bool IsClear(Vector vector);
//    virtual MotionStatus GetStatus();
};

#endif
