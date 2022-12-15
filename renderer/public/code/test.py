import sys
import trio

def main(argv):
    for i in range(100):
        print(i)
        trio.run(trio.sleep, 0.5)


if __name__ == "__main__":
    main(sys.argv)
