import os
import tempfile
import threading

class TempFileManager:
    def __init__(self, enable_concurrency=False):
        self.temp_dir = tempfile.mkdtemp()
        self.enable_concurrency = enable_concurrency
        self.lock = threading.Lock()
        self.file_paths = []

    def create_file(self, filename, content=None):
        file_path = os.path.join(self.temp_dir, filename)
        with open(file_path, 'w+b') as file:
            if content:
                file.write(content)
        with self.lock:
            self.file_paths.append(file_path)
        return file_path

    def __enter__(self):
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        with self.lock:
            for path in self.file_paths:
                os.remove(path)
            os.rmdir(self.temp_dir)

def file_operation(manager, filename, content):
    file_path = manager.create_file(filename, content)
    print(f"Temporary file {filename} created at: {file_path}")

def run_file_operations(files, enable_concurrency):
    with TempFileManager(enable_concurrency) as manager:
        if enable_concurrency:
            threads = []
            for filename, content in files.items():
                t = threading.Thread(target=file_operation, args=(manager, filename, content))
                t.start()
                threads.append(t)

            for t in threads:
                t.join()
        else:
            for filename, content in files.items():
                file_operation(manager, filename, content)