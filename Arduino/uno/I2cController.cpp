/*
  RhinoMotorControllerI2C.cpp - I2C implementation for controlling a Rhino Motor
*/

#include <Arduino.h>
#include <Wire.h>
#include "IMotorController.h"
#include "I2cController.h"

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

int I2cController::ConvertValue(float value)
{
  int result =  max(-1.0f, min(value, 1.0f)) * 255; // Force value within acceptable range [-1.0f, 1.0f]
  Serial.print("Converting float to int: "); Serial.print(value); Serial.print(" => "); Serial.println(result);
  return result;
}

float I2cController::ConvertValue(int value)
{
  int result = value / 255.0f;
  Serial.print("Converting int to float: "); Serial.print(value); Serial.print(" => "); Serial.println(result); 
  return result;
}


void I2cController::Attach(int address)
{  
  //i2cAddress = address >> 1; // this is bit shifted right by 1 for obvious, unknown reasons.
  i2cAddress = address;
  Wire.begin();
}

void I2cController::SetMaxSpeed(float value)
{
    Wire.beginTransmission(i2cAddress);
    Wire.write(I2C_MAX_SPEED);
    Wire.write(ConvertValue(value) >> 0); // LSB
    Wire.write(ConvertValue(value) >> 8); // MSB
    Wire.endTransmission();
    //delay(15); // maybe this is needed
}

void I2cController::SetSpeed(float value)
{
    Wire.beginTransmission(i2cAddress);
    Wire.write(I2C_SPEED);
    Wire.write(ConvertValue(value) >> 0); // LSB
    Wire.write(ConvertValue(value) >> 8); // MSB
    Wire.endTransmission();
    //delay(15); // maybe this is needed
}
   
void I2cController::SetDamping(float value)
{
    Wire.beginTransmission(i2cAddress);
    Wire.write(I2C_DAMPING);
    Wire.write(ConvertValue(value) >> 0);   // LSB
    Wire.write(ConvertValue(value) >> 8);    // MSB
    Wire.endTransmission();
    //delay(15); // maybe this is needed
}
    
void I2cController::SetRelativePosition(long value)
{
    Wire.beginTransmission(i2cAddress);
    Wire.write(I2C_GO_TO_RELATIVE_POSITION);
    Wire.write(value & 0x000000ff) >> 0;  // LSB
    Wire.write(value & 0x0000ff00) >> 8;
    Wire.write(value & 0x00ff0000) >> 16;
    Wire.write(value & 0xff000000) >> 32;  // MSB
    Wire.endTransmission();
    //delay(15); // maybe this is needed
  }
  
float I2cController::ReadSpeed()
{

  int value = 0;
  Wire.beginTransmission(i2cAddress);
  Wire.write(I2C_SPEED);
  Wire.endTransmission();
  delay(15);
  
  Wire.requestFrom(i2cAddress, 1);
  while(Wire.available())
  { value = Wire.read(); }
  
  return ConvertValue(value);
}

float I2cController::ReadMaxSpeed()
{

  int value = 0;
  Wire.beginTransmission(i2cAddress);
  Wire.write(I2C_MAX_SPEED);
  Wire.endTransmission();
  delay(15);
  
  Wire.requestFrom(i2cAddress, 1);
  while(Wire.available())
  { value = Wire.read(); }
  
  return ConvertValue(value);
}

float I2cController::ReadDamping()
{

  int value = 0;
  Wire.beginTransmission(i2cAddress);
  Wire.write(I2C_DAMPING);
  Wire.endTransmission();
  delay(15);
  
  Wire.requestFrom(i2cAddress, 1);
  while(Wire.available())
  { value = Wire.read(); }
  return ConvertValue(value);
}

long I2cController::ReadPosition()
{
  // Request encoder position
  Wire.beginTransmission(i2cAddress);
  Wire.write(I2C_ENCODER_POSITION);
  Wire.endTransmission();
  delay(15);
  
  Wire.requestFrom(i2cAddress, 4);
  
  // Wait for the motor to be ready to respond
  while(!Wire.available())
  { delay(15); }
  
  return (Wire.read() << 0) | (Wire.read() << 8) | (Wire.read() << 16) | (Wire.read() << 24);
}
