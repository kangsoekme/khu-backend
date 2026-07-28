import os
from spire.doc import *
from spire.doc.common import *

print("Memulai konversi laporan_ummi_template.doc ke docx...")
doc = Document()
doc.LoadFromFile("templates/laporan_ummi_template.doc")
doc.SaveToFile("templates/laporan_ummi_template.docx", FileFormat.Docx2013)
doc.Close()
print("✔ Berhasil konversi ke templates/laporan_ummi_template.docx!")

# Mari kita baca teks dari docx yang baru dibuat untuk melihat isinya
doc_check = Document()
doc_check.LoadFromFile("templates/laporan_ummi_template.docx")
print("\n=== TEKS DOKUMEN ===")
print(doc_check.GetText()[:4000])
doc_check.Close()
