let uniqueEmails = new Set();

const csvInput = document.getElementById("csvInput");
const dropZone = document.getElementById("dropZone");
const emailTextarea = document.getElementById("emailTextarea");
const downloadBtn = document.getElementById("downloadBtn");
const bottomP = document.getElementById("bottomp");

csvInput.addEventListener("change", (e) => {
  handleFiles(e.target.files);
});

dropZone.addEventListener("dragover", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#333";
});

dropZone.addEventListener("dragleave", () => {
  dropZone.style.borderColor = "#ccc";
});

dropZone.addEventListener("drop", (e) => {
  e.preventDefault();
  dropZone.style.borderColor = "#ccc";
  handleFiles(e.dataTransfer.files);
});

function handleFiles(fileList) {
  for (let file of fileList) {
    if (file.type === "text/csv") {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          results.data.forEach((row) => {
            Object.values(row).forEach((value) => {
              const email = value.trim();
              if (isValidEmail(email)) {
                uniqueEmails.add(email.toLowerCase());
              }
            });
          });
          updateTextarea();
        },
      });
    }
  }
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function updateTextarea() {
  emailTextarea.value = Array.from(uniqueEmails).join("\n");
}

downloadBtn.addEventListener("click", () => {
  if (uniqueEmails.size === 0) return alert("No emails to download.");
  const csv = "email\n" + Array.from(uniqueEmails).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "unique_emails.csv";
  link.click();
});

function updateTextarea() {
  const emails = Array.from(uniqueEmails);
  emailTextarea.value = emails.join("\n");
  bottomP.innerHTML = `Total unique emails: ${emails.length}`;
}
