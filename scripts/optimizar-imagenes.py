"""Genera las fotos web (WebP) en img/ a partir de los originales de docs/imagenes/.

Uso: py scripts/optimizar-imagenes.py
"""
from pathlib import Path
from PIL import Image, ImageOps

RAIZ = Path(__file__).resolve().parent.parent
ORIGEN = RAIZ / "docs" / "imagenes"
DESTINO = RAIZ / "img"

# nombre: (ancho máximo, recorte (izq, arriba, der, abajo) en fracciones o None)
FOTOS = {
    "cueros-grabado-cocodrilo-colores": (1800, None),
    # quita el sticker de la mano dibujada abajo a la izquierda
    "cueros-charol-cocodrilo-azules-dorados": (1000, (0.17, 0, 1, 1)),
    "cueros-estampado-serpiente": (1000, None),
    "cueros-grabado-mantarraya": (1000, None),
    "napas-lisas-colores-pastel": (1000, None),
    "cueros-metalizados-lentejuela": (1000, None),
}

DESTINO.mkdir(exist_ok=True)
for nombre, (ancho, recorte) in FOTOS.items():
    img = ImageOps.exif_transpose(Image.open(ORIGEN / f"{nombre}.jpg")).convert("RGB")
    if recorte:
        w, h = img.size
        img = img.crop((int(recorte[0] * w), int(recorte[1] * h), int(recorte[2] * w), int(recorte[3] * h)))
    img.thumbnail((ancho, ancho * 2))
    salida = DESTINO / f"{nombre}.webp"
    img.save(salida, "WEBP", quality=78, method=6)
    print(f"{salida.name}: {img.size[0]}x{img.size[1]}, {salida.stat().st_size // 1024} KB")
