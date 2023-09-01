package expo.modules.lockscreen

import android.app.Dialog
import android.os.Bundle
import android.util.Log
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.TableRow
import androidx.fragment.app.DialogFragment

class NumericKeypadDialog : DialogFragment() {
  override fun onCreateDialog(savedInstanceState: Bundle?): Dialog {
    return createNumericKeypadDialog()
  }

  private fun createNumericKeypadDialog(): Dialog {
    val dialog = Dialog(requireActivity())
    dialog.setContentView(R.layout.numeric_keypad_dialog)
    val table = dialog.findViewById<ViewGroup>(R.id.table)
    for (i in 0 until table.childCount) {
      val row = table.getChildAt(i) as TableRow
      for (j in 0 until row.childCount) {
        val view = row.getChildAt(j)
        (view as? Button)?.setOnClickListener { v: View? ->
          buttonPressed(
            view
          )
        }
      }
    }
    return dialog
  }

  private fun buttonPressed(view: View) {
    val button = view as Button
    Log.d("NumericKeypadDialog", "Button pressed: " + button.text)
  }
}
