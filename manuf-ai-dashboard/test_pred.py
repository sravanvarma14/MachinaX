import traceback
import sys
sys.path.insert(0, '.')
from api import app, InputData, predict

try:
    mat_a = float(input("Enter Material A Quantity: "))
    mat_b = float(input("Enter Material B Quantity: "))
    duration = float(input("Enter Process Duration (Hours): "))
    
    print("\nResult:")
    print(predict(InputData(Material_A_Quantity=mat_a, Material_B_Quantity=mat_b, Process_Duration_Hours=duration)))
except Exception as e:
    traceback.print_exc()
