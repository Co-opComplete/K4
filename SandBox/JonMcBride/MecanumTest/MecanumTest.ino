#include <Wire.h>
#include <SoftwareSerial.h>
#include <Arduino.h>
#include "IMotorController.h"
#include "Mecanum.h"
#include "MotionStatus.h"
#include "IMotionController.h"
#include "Vector.h"
#include "FakeMotorController.h"

FakeMotorController *MA = new FakeMotorController("A");
FakeMotorController *MB = new FakeMotorController("B");
FakeMotorController *MC = new FakeMotorController("C");
FakeMotorController *MD = new FakeMotorController("D");
Mecanum robot;

int counter = 0;
int resetCount = 8;
bool addRotation = false;
float angle = 0;
Vector *translation;
float rotation = 0.0f;

void setup() 
{
  Serial.begin(9600);
  robot.Attach(MA, MB, MC, MD);
}

void loop() 
{  
  angle = (translation->angle + (PI / 4)) < (2 * PI)
       ?  (translation->angle + (PI / 4))
       : 0;
  translation = new Vector(angle, 1.0f);
  
  rotation = !addRotation 
           ? 0.0f 
           : rotation + 0.2f;
 
  Serial.print("Translation angle: ");
  Serial.println(translation->angle);
  Serial.print("Translation magnitude: ");
  Serial.println(translation->magnitude);
  Serial.print("Rotation: ");
  Serial.println(rotation);

  robot.Move(*translation, rotation);
  counter++;
  
  if (counter >= resetCount)
  {
    counter = 0;
    addRotation = !addRotation;
    rotation = -0.8f;
  }
  delay(2000);
}
