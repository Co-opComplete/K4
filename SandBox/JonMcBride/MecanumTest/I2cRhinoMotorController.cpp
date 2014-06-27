/*
  RhinoMotorControllerI2C.cpp - I2C implementation for controlling a Rhino Motor
*/

#include <Arduino.h>
#include <Wire.h>
#include "IRhinoMotorController.h"
#include "I2cRhinoMotorController.h"

#define I2C_MAX_SPEED                 0
#define I2C_SPEED                     1
#define I2C_DAMPING                   2
#define I2C_ENCODER_POSITION          3
#define I2C_GO_TO_POSITION            4
#define I2C_SPEED_FEEDBACK_GAIN_TERM  5
#define I2C_P_GAIN_TERM               6
#define I2C_I_GAIN_TERM               7
#define I2C_GO_TO_RELATIVE_POSITION   8

I2cController::I2cController()
{ }

void I2cController::Attach(int address)
{  
  i2cAddress = address >> 1; // this is bit shifted right by 1 for obvious, unknown reasons.
  Wire.begin();
}

void I2cController::WriteMaxSpeed(int value)
{
    Wire.beginTransmission(i2cAddress);
    Wire.write(I2C_MAX_SPEED);
    Wire.write(value >> 0); // LSB
    Wire.write(value >> 8); // MSB
    Wire.endTransmission();
    delay(10); // maybe this is needed
}

void I2cController::WriteSpeed(int value)
{
    Wire.beginTransmission(i2cAddress);
    Wire.write(I2C_SPEED);
    Wire.write(value >> 0); // LSB
    Wire.write(value >> 8); // MSB
    Wire.endTransmission();
    delay(10); // maybe this is needed
}
   
void I2cController::WriteDamping(int value)
{
    Wire.beginTransmission(i2cAddress);
    Wire.write(I2C_DAMPING);
    Wire.write(value >> 0);   // LSB
    Wire.write(value >> 8);    // MSB
    Wire.endTransmission();
    delay(10); // maybe this is needed
}
    
void I2cController::WriteRelativePosition(long value)
{
    Wire.beginTransmission(i2cAddress);
    Wire.write(I2C_GO_TO_RELATIVE_POSITION);
    Wire.write(value >> 0  & 0x000000ff);  // LSB
    Wire.write(value >> 8  & 0x0000ff00);
    Wire.write(value >> 16 & 0x00ff0000);
    Wire.write(value >> 24 & 0xff000000);  // MSB
    Wire.endTransmission();
    delay(10); // maybe this is needed
  }
  
int I2cController::ReadSpeed()
{

  int value = 0;
  Wire.beginTransmission(i2cAddress);
  Wire.write(I2C_SPEED);
  Wire.endTransmission();
  delay(10);
  
  Wire.requestFrom(i2cAddress, 1);
  while(Wire.available())
  { value = Wire.read(); }
  
  return value;
}

int I2cController::ReadMaxSpeed()
{

  int value = 0;
  Wire.beginTransmission(i2cAddress);
  Wire.write(I2C_MAX_SPEED);
  Wire.endTransmission();
  delay(10);
  
  Wire.requestFrom(i2cAddress, 1);
  while(Wire.available())
  { value = Wire.read(); }
  
  return value;
}

int I2cController::ReadDamping()
{

  int value = 0;
  Wire.beginTransmission(i2cAddress);
  Wire.write(I2C_DAMPING);
  Wire.endTransmission();
  delay(10);
  
  Wire.requestFrom(i2cAddress, 1);
  while(Wire.available())
  { value = Wire.read(); }
  
  return value;
}

long I2cController::ReadPosition()
{
  // Request encoder position
  Wire.beginTransmission(i2cAddress);
  Wire.write(I2C_ENCODER_POSITION);
  Wire.endTransmission();
  delay(10);
  
  Wire.requestFrom(i2cAddress, 4);
  
  // Wait for the motor to be ready to respond
  while(!Wire.available())
  { delay(10); }
  
  return (Wire.read() << 0) | (Wire.read() << 8) | (Wire.read() << 16) | (Wire.read() << 24);
}
