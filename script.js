// عرف الدالة لإضافة العضو
function addMember() {
    var name = document.getElementById("memberName").value;
    var amount = parseFloat(document.getElementById("amountPaid").value) || 0;
    var table = document.getElementById("membersTable");

    // إنشاء صف جديد
    var row = table.insertRow(-1);
    var nameCell = row.insertCell(0);
    var amountCell = row.insertCell(1);
    var statusCell = row.insertCell(2);
    var deleteCell = row.insertCell(3);

    // تعيين قيم الخلايا
    nameCell.innerHTML = name;
    amountCell.innerHTML = amount.toFixed(2);

    // تحديث حالة الدفع
    if (amount > 0) {
        statusCell.innerHTML = "✔️";
        statusCell.className = "paid";
    } else {
        statusCell.innerHTML = "❌";
        statusCell.className = "unpaid";
    }

    // إنشاء زر الحذف
    var deleteButton = document.createElement("button");
    deleteButton.innerHTML = "حذف";
    deleteButton.className = "deleteButton";
    deleteButton.onclick = function() {
        if (confirm("⚠️: هل أنت متأكد من رغبتك في حذف العضو '" + name + "'؟")) {
            table.deleteRow(row.rowIndex);
            // حذف العضو من Local Storage
            var members = JSON.parse(localStorage.getItem("members")) || [];
            members.splice(row.rowIndex - 1, 1);
            localStorage.setItem("members", JSON.stringify(members));
            updateTotalAmount();
        }
    };
    deleteCell.appendChild(deleteButton);

    // حفظ البيانات في Local Storage
    var members = JSON.parse(localStorage.getItem("members")) || [];
    members.push({ name: name, amount: amount });
    localStorage.setItem("members", JSON.stringify(members));

    // مسح الحقول بعد الإضافة
    document.getElementById("memberName").value = "";
    document.getElementById("amountPaid").value = "0";

    // تحديث مجموع القطة
    updateTotalAmount();
}

// دالة لطباعة الكشف
function printReport() {
    window.print();
}

// تحميل البيانات من Local Storage عند فتح الصفحة
window.onload = function() {
    var members = JSON.parse(localStorage.getItem("members")) || [];
    var table = document.getElementById("membersTable");

    members.forEach(function(member) {
        var row = table.insertRow(-1);
        var nameCell = row.insertCell(0);
        var amountCell = row.insertCell(1);
        var statusCell = row.insertCell(2);
        var deleteCell = row.insertCell(3);

        nameCell.innerHTML = member.name;
        amountCell.innerHTML = parseFloat(member.amount).toFixed(2);

        if (parseFloat(member.amount) > 0) {
            statusCell.innerHTML = "✔️";
            statusCell.className = "paid";
        } else {
            statusCell.innerHTML = "❌";
            statusCell.className = "unpaid";
        }

        // إنشاء زر الحذف
        var deleteButton = document.createElement("button");
        deleteButton.innerHTML = "حذف";
        deleteButton.className = "deleteButton";
        deleteButton.onclick = function() {
            if (confirm("⚠️: هل أنت متأكد من رغبتك في حذف العضو '" + member.name + "'؟")) {
                table.deleteRow(row.rowIndex);
                // حذف العضو من Local Storage
                var index = members.findIndex(function(m) {
                    return m.name === member.name && m.amount === member.amount;
                });
                if (index !== -1) {
                    members.splice(index, 1);
                    localStorage.setItem("members", JSON.stringify(members));
                    updateTotalAmount();
                }
            }
        };
        deleteCell.appendChild(deleteButton);
    });

    // تحديث مجموع القطة عند تحميل الصفحة
    updateTotalAmount();
};

// دالة لتحديث مجموع القطة
function updateTotalAmount() {
    var members = JSON.parse(localStorage.getItem("members")) || [];
    var total = members.reduce((sum, member) => sum + parseFloat(member.amount), 0);
    document.getElementById("totalAmount").innerText = "مجموع القطة: " + total.toFixed(2);
}

// إضافة حدث keyup لإدخال البيانات عند الضغط على Enter
document.getElementById("memberName").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addMember();
    }
});
document.getElementById("amountPaid").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        addMember();
    }
});
