import subprocess
import os

chrome = r'C:\Program Files\Google\Chrome\Application\chrome.exe'
html = '<!DOCTYPE html><html><body><script>document.title = "WIDTH:" + window.innerWidth;</script></body></html>'
with open('test_width.html', 'w') as f:
    f.write(html)

cmd = [chrome, '--headless=new', '--disable-gpu', '--window-size=360,780', '--dump-dom', os.path.abspath('test_width.html')]
res = subprocess.run(cmd, capture_output=True, text=True)
print([line for line in res.stdout.splitlines() if 'title' in line or 'WIDTH' in line])
