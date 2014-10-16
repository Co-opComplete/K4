#include <Arduino.h>
#include <math.h>
#include "Mecanum.h"
#include "MotionStatus.h"
#include "IMotorController.h"

void Mecanum::Attach(IMotorController *_MA, IMotorController *_MB, IMotorController *_MC, IMotorController *_MD)
{
  MA = _MA;
  MB = _MB;
  MC = _MC;
  MD = _MD;
}

bool Mecanum::Move(Vector translation, float rotation)
{
  /*
    a - front left
    b - front right
    c - back right
    d - back left
  */

  float a = translation.magnitude * sin(translation.angle + PI/4) + rotation;
  float b = translation.magnitude * cos(translation.angle + PI/4) - rotation;
  float c = translation.magnitude * sin(translation.angle + PI/4) - rotation;
  float d = translation.magnitude * cos(translation.angle + PI/4) + rotation;
  
  float scalar = max(
                      max(abs(a), abs(b)),
                      max(abs(c), abs(d))
                    ); 
  
  if (scalar > 1.0f)
  {
    a = min(a / scalar, 1.0f);
    b = min(b / scalar, 1.0f);
    c = min(c / scalar, 1.0f);
    d = min(d / scalar, 1.0f);
  }
  
  MA->WriteSpeed(a);
  MB->WriteSpeed(b);
  MC->WriteSpeed(c);
  MD->WriteSpeed(d);
  
  return true;
}

bool Mecanum::IsClear(Vector vector)
{
  return true;
}

/*MotionStatus Mecanum::GetStatus()
{
  MotionStatus Status();
  return Status;
}*/
