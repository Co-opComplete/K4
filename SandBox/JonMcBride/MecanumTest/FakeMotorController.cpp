#include <Arduino.h>
#include "FakeMotorController.h"

FakeMotorController::FakeMotorController(String _motorName)
{
  motorName = _motorName;
}

void FakeMotorController::WriteMaxSpeed(float value) 
{
  Serial.print(motorName);
  Serial.print(" Max Speed: ");
  Serial.println(value);
}

void FakeMotorController::WriteSpeed(float value)
{
  Serial.print(motorName);
  Serial.print(" Speed: ");
  Serial.println(value);
}

void FakeMotorController::WriteDamping(float value) 
{
  Serial.print(motorName);
  Serial.print(" Damping: ");
  Serial.println(value);
}

void FakeMotorController::WriteRelativePosition(long value)
{
  Serial.print(motorName);
  Serial.print(" Releative Position: ");
  Serial.println(value);
}

float FakeMotorController::ReadSpeed() 
{
  return 0;
}

float FakeMotorController::ReadMaxSpeed() 
{
  return 0;
}

float FakeMotorController::ReadDamping() 
{
  return 0;
}

long FakeMotorController::ReadPosition() 
{
  return 0;
}
