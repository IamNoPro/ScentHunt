# ScentHunt | Smell-Based Navigation for a Treasure Hunt Game

## 📜 Project Overview
**ScentHunt** is a handheld scent-based navigator for treasure hunts.  
Using GPS cues from a smartphone app, it emits distinct fragrances for **Left**, **Right**, **Forward**, and **Stop**, guiding players to hidden treasure without visual or audio cues.

---

## 🎯 Inspiration
Smell-based navigation has never been widely applied in real-life activities, despite research showing that humans often use scent unconsciously for orientation.  
We create "smell maps" in daily life without realizing it — the aroma of bread signaling a bakery nearby, or gasoline indicating a gas station.

Since reproducing natural smells with current tech is impractical, I shifted the idea to a treasure hunt game. This allows full control over scents and a fun, competitive setting to test the concept.

---

## 🛠 How It Works
### Roles
- **Hider** – Hides the treasure via the smartphone app.
- **Seekers** – Use the app to calculate GPS position and request a direction from the ScentHunt device.

### Gameplay
1. Seekers press a button in the app to request guidance.
2. The ScentHunt device emits a scent corresponding to a direction:
   - **Forward**
   - **Left**
   - **Right**
   - **Stop** (treasure found / game over)
3. Goal: Find the treasure **with the fewest requests**.  
   Winning is not just about finding the treasure, but finding it efficiently.
4. The hider can set a **time limit** for added challenge.

---

## 💡 Design Process
### Software
- Built the iOS app in **Xcode** for GPS positioning and BLE communication with the ESP32.

### Hardware
- Explored 5 methods of scent emission:
  1. Ultrasonic disc
  2. Pressurized cartridges
  3. Solenoid valve
  4. Evaporative diffusion
  5. Fan-based diffusion  
  ➡ Chose **ultrasonic discs** for this project.

- Used **4 ultrasonic mist makers** (each with its own PCB) for the four scents.
- Controlled by an **ESP32** to receive BLE commands from the app.
- 3D model design inspired by **Moodo**, with modifications for function and aesthetics.

---

## 🆚 How It’s Different
- Previous smell-based navigation projects were mostly limited to **VR games** or static setups.
- **ScentHunt** operates **in the real world**, guiding players in real-time using GPS positioning and a mobile app.

---

## 🔮 Future Plans
1. **Custom PCB** for ultrasonic discs → allows a more compact and ergonomic 3D model.
2. Switch from **USB power bank** to a **LiPo battery** for reduced weight.
3. Redesign 3D enclosure:
   - Move from **4 separate holes** to a **single outlet** with internal scent switching.
   - Avoid players deducing direction from mist position instead of scent.
4. Create a **replaceable scent cartridge system** similar to Moodo.
5. Improve durability and portability for outdoor use.

---

## 📷 Gallery

### Hardware Prototype
![Prototype with exposed components](Nurlykjan%20Kopenov%20-%20Image1.jpg)
![First assembled prototype](Nurlykhan%20Kopenov%20-%20Image2.jpg)

### Mobile App Screens
![App start screen](Nurlykhan%20Kopenov%20-%20Image4.jpg)
![Seeker map interface](Nurlykhan%20Kopenov%20-%20Image5.jpg)

### Final Enclosure Design
![Final prototype with closed enclosure](Nurlykhan%20Kopenov%20-%20Image3.jpg)

---

## ⚙ Tech Stack
- **Hardware:** ESP32, ultrasonic mist makers, 3D-printed enclosure
- **Software:** Xcode (iOS), BLE communication
- **Design:** Fusion 360 (3D modeling)

---

## 📄 License
Need to get MIT LICENse

---

## 👤 Author
**Nurlykhan Kopenov**  
📧 [nurlykhan.kopenov@gmail.com]

