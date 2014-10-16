/*
  Vector.h - Library for controlling mecanum wheels
*/

#ifndef __Vector_H__
#define __Vector_H__

#include <Arduino.h>

class Vector
{
  public:
    float angle;
    float magnitude;
    
    Vector();
    Vector(float angle, float magnitude);
};

#endif
