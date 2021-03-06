#include<Servo.h>
#define LEFT1_PIN 2
#define LEFT2_PIN 3
#define RIGHT1_PIN 4
#define RIGHT2_PIN 5
#define LEFT_RELAY_PIN 50
#define RIGHT_RELAY_PIN 52
#define LEFT 108
#define RIGHT 114
#define FORWARD 43
#define REVERSE 45

Servo Left1;
Servo Left2;
Servo Right1;
Servo Right2;

byte Motor;
byte Dir;
byte Spd;

byte buff[3];
int error = 0;



void setup() {
  // Set up serial ports
  SerialUSB.begin(9600);
  Serial1.begin(9600);
  
  // Set up servo pins
  Left1.attach(LEFT1_PIN);
  Left2.attach(LEFT2_PIN);
  Right1.attach(RIGHT1_PIN);
  Right2.attach(RIGHT2_PIN);
  
  pinMode(LEFT_RELAY_PIN, OUTPUT);
  pinMode(RIGHT_RELAY_PIN, OUTPUT);
  digitalWrite(LEFT_RELAY_PIN, LOW);
  digitalWrite(RIGHT_RELAY_PIN, LOW);
  
  // Initialize motor speed to full stop.
  Left1.write(90);
  Left2.write(90);
  Right1.write(90);
  Right2.write(90);

  Motor = 0;
  Dir = 0;
  Spd = 0;
  
  delay(3000);
}

void loop() {
  SerialUSB.println("Awaiting commands");
  
  while(!Serial1.available())
  { delay(50); }
  
  SerialUSB.println("Received command");
  Serial1.readBytes(buff, 3);
  ParseData(buff[0], buff[1], buff[2]);
    
  if (!error)
  { 
    if (Motor == LEFT)
    { DriveLeft(Spd); }
    else
    { DriveRight(Spd); }
  }
  // reset error flag
  error = 0;
}


void ParseData(byte motor, byte dir, byte spd)
{
   SerialUSB.print("Received: ");
   SerialUSB.print(motor);
   SerialUSB.print(" ");
   SerialUSB.print(dir);
   SerialUSB.print(" ");
   SerialUSB.println(spd);
   
    if ((motor != LEFT && motor != RIGHT) || (dir != FORWARD && dir != REVERSE) || (spd < 0 || spd > 100))
    { PrintError(); }
    else
    {
      Motor = motor;
      Spd = dir == FORWARD ? 90 + (90 * (spd / 100)) : 90 - (90 * (spd / 100));
    }
}

void DriveLeft(int spd)
{
  Left1.write(spd);
  Left2.write(spd);
  SerialUSB.print("Left Motor ");
  SerialUSB.println(spd);
}

void DriveRight(int spd)
{
  Right1.write(spd);
  Right2.write(spd);
  SerialUSB.print("Right Motor ");
  SerialUSB.println(spd);
}

void PrintError()
{
  SerialUSB.print("Error!!! Bad data: ");
  SerialUSB.print(buff[0]);
  SerialUSB.print(" ");
  SerialUSB.print(buff[1]);
  SerialUSB.print(" ");
  SerialUSB.print(buff[2]);
  SerialUSB.println("");
  error = 1;
}
