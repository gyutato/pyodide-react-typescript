import sys
print(f"Python version: {sys.version}")

async def install_packages():
    import micropip
    await micropip.install('lifelines')
    print("Lifelines package installed successfully!")

# Python에서 비동기 함수 호출은 다음과 같이 해야 함
await install_packages() 