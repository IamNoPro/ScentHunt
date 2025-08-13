# ScentHunt - A GPS-based scent navigation device for treasure hunts
REPORT


PROJECT NAME

ScentHunt | Smell Based Navigation for a Treasure Hunt Game

WHAT YOUR PROJECT DOES?|


A handheld scent-based navigator for treasure hunts that, using GPS cues from a smartphone app, emits distinct fragrances - left, right, forward, stop - guiding the players to hidden loot of treasure.

YOUR INSPIRATION (where you got your inspiration?)
Smell based navigation has never been used in real life situations, even though there has been research showing that people use smell unconsciously to get to the places they want. Usually, people create smell map unconsciously(e.g smell of gas meaning near gas station, smell of bread meaning near pastry shop). Therefore, I wanted to create smell based navigation. However, the smells people use are natural smells, and current technology doesn’t allow it to create natural smells, so I decided to shift to smell based navigation for a treasure hunt game.

HOW IT WORKS
The rules of the game:
There is one “hider”: the player who hides the treasure using a phone application. And many “seekers”, who will use a phone application for GPS position calculation and request for direction to the ScentHunt Handheld device. A handheld device will emit smell based on the seekers position and when requested direction from the player. The emitted smell depends on the 4 directions: Forward, Left, Right and one direction, which is stop, when the game ends. 
The rule of the game is to find the treasure with the minimal requests for a smell direction. Finding the treasure doesn’t guarantee winning, but finding it with minimal requests for direction does. There will also be a time limit, which will be given by the hider.


DESIGN PROCESS (how you developed your design?)
For the software I have used Xcode to build the application on the Iphone.
For the hardware:
First, I needed to find a way to create a smell. There were 5 ways: ultrasonic disc, pressurized cartridges, solenoid valve, evaporative diffusion, fan based diffusion. From trying out different ways, I concluded that an ultrasonic disc is the best way for my project.
I used 4 ultrasonic mist makers with their own pcb, which really made it difficult to customize the design. And the brain was an esp32 model, which is needed to receive commands from the phone application. 
For the design of the 3D model, I actually didn’t do any research, but I liked Moodo. So I wanted something similar to that. However, there are many things I wanted to change in design, starting from creating my own pcb. Actually if there was no word limit, I would write an essay of struggles and genius ideas(genius only for me) that I came up with.

HOW IT IS DIFFERENT FROM PREVIOUS WORKS/PROJECTS/INVENTIONS?
There were projects about using smell based navigation devices in VR games. However, mostly they were static in place, meaning that navigation happens only in a game not in real life. But for my project, my device is used to navigate in real-time using gps positioning. 

FUTURE PLANS
There are many things I want to change in my project. First, creating my own pcb for the ultrasonic disc, because it would help me to create a better shaped 3d model. Currently my device works with a usb power bank, which adds additional weight to hold, I want to change it to a lipo battery. While using my device myself, I understood that there is a flaw in a 3d model design. In my design, 4 directions connect to 4 smells. I thought then I should have 4 holes in my 3d model so that it will emit depending on the smell. But with 4 holes, it doesn’t actually require smell to understand which direction I should move, only the generated mist is enough.
So I need to make only one hole on top, and find a way to switch smells on the background.
Moreover, I wanted to create a Moodo like structure, so that my smell bottles will be replaceable. It’s very important to be able to replace a bottle of smell. I need to think about that part.
