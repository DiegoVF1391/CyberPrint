import sys
import os

archivo = sys.argv[1]

if os.name == 'nt':  # Windows
    try:
        os.startfile(archivo, "print")
        print(f"Imprimiendo {archivo}")
    except Exception as e:
        print(f"Error al imprimir: {e}")
else:
    print("Este script solo funciona en Windows.")
