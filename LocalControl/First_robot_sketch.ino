#include<Servo.h>
#define LEFT1_PIN 2
#define LEFT2_PIN 3
#define RIGHT1_PIN 4
#define RIGHT2_PIN 5
#define LEFT_RELAY_PIN 52
#define RIGHT_RELAY_PIN 50
#define LEFT 108
#define RIGHT 114
#define FORWARD 43
#define REVERSE 45
#define USER_BUF_SIZE 10
#define MOTOR_BUF_SIZE 20

Servo Left1;
Servo Left2;
Servo Right1;
Servo Right2;

byte Motor;
byte Dir;
byte Spd;

char buff[3];
int error = 0;

int readCount;
int sendCount;
int motorState;
byte userBuf[10];
byte motorBuf[10];

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
  /*for(int i = 0; i <= 180; i++) {
    Left1.write(i);
    delay(50);
  }
  for(int i = 180; i >= 0; i--) {
    Left1.write(i);
    delay(50);
  }
  */
  
  /* Testing Code
  // wait for the user to send command
  while(!SerialUSB.available())
  { delay(100); }
  
  // consume user input
  readCount = SerialUSB.readBytes(userBuf, USER_BUF_SIZE);
  
  if (userBuf[0] == 'P')
  { HandlePowerRequest(); }
  else
  {
    Left1.write(0);
    delay(3000);
    Left1.write(180);
    delay(3000);
  }
  */
  
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

void HandlePowerRequest()
{
  if (readCount == 3) // includes linefeed and carriage return
  {
    if (motorState == 0)
    { SerialUSB.println("Motor off"); }
    else
    { SerialUSB.println("Motor on"); }
  }
  else if (userBuf[1] == 'o' && userBuf[2] == 'n')
  { MotorPowerOn(); }
  else if (userBuf[1] = 'o' && userBuf[2] == 'f' && userBuf[3] == 'f')
  { MotorPowerOff(); }
  else 
  { 
    SerialUSB.println("ERR");
  }
}

void MotorPowerOn()
{
  digitalWrite(LEFT_RELAY_PIN, LOW);
  motorState = 1;
  SerialUSB.println("Turning motor on.");
  delay(500);
  
  //HandleMotorResponse();
}

void MotorPowerOff()
{
  digitalWrite(LEFT_RELAY_PIN, HIGH);
  motorState = 0;
  SerialUSB.println("Turning motor off");
  SerialUSB.print(":");
  
  //HandleMotorResponse();
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
      Spd = (int) (dir == FORWARD ? 90 + (90 * ((float)spd / 100.0)) : 90 - (90 * ((float)spd / 100.0)));
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
