#include <Arduino.h>
#include <math.h>
#include "Mecanum.h"
#include "Status.h"
#include "IMotorController.h"

void Mecanum::Attach(IMotorController *_MA, IMotorController *_MB, IMotorController *_MC, IMotorController *_MD)
{
  MA = _MA;
  MB = _MB;
  MC = _MC;
  MD = _MD;
}

void Mecanum::Configure(float maxSpeed, float damping)
{
  MA->SetMaxSpeed(maxSpeed);
  MB->SetMaxSpeed(maxSpeed);
  MC->SetMaxSpeed(maxSpeed);
  MD->SetMaxSpeed(maxSpeed);

  MA->SetDamping(maxSpeed);
  MB->SetDamping(maxSpeed);
  MC->SetDamping(maxSpeed);
  MD->SetDamping(maxSpeed);
}

bool Mecanum::Move(Vector translation, float rotation)
{
  /*
    a - front left
    b - front right
    c - back right
    d - back left
  */

  float a = -(translation.magnitude * sin(translation.angle + PI / 4) + rotation);
  float b =  (translation.magnitude * cos(translation.angle + PI / 4) - rotation);
  float c = -(translation.magnitude * cos(translation.angle + PI / 4) + rotation);
  float d =  (translation.magnitude * sin(translation.angle + PI / 4) - rotation);

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
  
  Serial.println("Motor A: "); Serial.print(a); Serial.println();
  Serial.println("Motor B: "); Serial.print(b); Serial.println();
  Serial.println("Motor C: "); Serial.print(c); Serial.println();
  Serial.println("Motor D: "); Serial.print(d); Serial.println();

  MA->SetSpeed(a);
  MB->SetSpeed(b);
  MC->SetSpeed(c);
  MD->SetSpeed(d);
  
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
