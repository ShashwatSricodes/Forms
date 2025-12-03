import tkinter as tk
import time
import threading

class GoBackNAnimation:
    def __init__(self, root):
        self.root = root
        self.root.title("Go-Back-N ARQ Simulation")

        # Input fields
        tk.Label(root, text="Window Size (N):").pack()
        self.n_entry = tk.Entry(root)
        self.n_entry.pack()

        tk.Label(root, text="Total Frames:").pack()
        self.frames_entry = tk.Entry(root)
        self.frames_entry.pack()

        tk.Label(root, text="Frame to lose (or -1 for none):").pack()
        self.loss_entry = tk.Entry(root)
        self.loss_entry.pack()

        tk.Button(root, text="Start Simulation", command=self.start_simulation).pack()

        self.canvas = tk.Canvas(root, width=700, height=300, bg="white")
        self.canvas.pack()

        self.status = tk.Label(root, text="", fg="blue")
        self.status.pack()

    def start_simulation(self):
        try:
            self.N = int(self.n_entry.get())
            self.total = int(self.frames_entry.get())
            self.loss_frame = int(self.loss_entry.get())
        except:
            self.status.config(text="Enter valid integers")
            return
        
        self.status.config(text="Simulation running...")
        threading.Thread(target=self.run).start()

    def send_frame(self, frame_no, y, color="lightblue"):
        x = 50 + frame_no*40
        return self.canvas.create_rectangle(x, y, x+30, y+30, fill=color), x

    def ack_frame(self, x, y):
        return self.canvas.create_text(x+15, y, text="ACK", fill="green")

    def run(self):
        self.canvas.delete("all")
        base = 0
        next_frame = 0
        y_send = 80
        y_ack = 200

        while base < self.total:
            # Send frames in window
            while next_frame < base + self.N and next_frame < self.total:
                rect, x = self.send_frame(next_frame, y_send)
                self.canvas.update()
                time.sleep(0.3)
                next_frame += 1

            # Simulate ACKs or loss
            for f in range(base, next_frame):
                if f == self.loss_frame:
                    # Lost frame
                    self.status.config(text=f"Frame {f} lost. Timeout. Go back to {base}.")
                    time.sleep(1)
                    # Retransmit from base
                    next_frame = base
                    break
                else:
                    _, x = self.send_frame(f, y_send, color="lightgreen")
                    self.canvas.update()
                    time.sleep(0.3)
                    self.ack_frame(x, y_ack)
                    self.canvas.update()
                    time.sleep(0.2)
                    base += 1
        
        self.status.config(text="All frames delivered successfully ✔")

# Run the GUI
root = tk.Tk()
GoBackNAnimation(root)
root.mainloop()
