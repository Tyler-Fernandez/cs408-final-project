
import {sayHello} from '../js/main.js';

QUnit.module('hello', function() {

    QUnit.test('make sure the hello function says hello', function(assert) {
        var result = sayHello();
        assert.equal(result, 'hello');
    });


});

QUnit.module('table operations', {
    beforeEach() {
        // Create a table and tbody similar to the app so tests can manipulate it
        this.table = document.createElement('table');
        this.table.id = 'items-table';
        const thead = document.createElement('thead');
        thead.innerHTML = '<tr><th>Id</th><th>Name</th><th>Price</th><th>Action</th></tr>';
        this.table.appendChild(thead);
        this.tbody = document.createElement('tbody');
        this.tbody.id = 'items-body';
        this.table.appendChild(this.tbody);
        document.body.appendChild(this.table);
    },
    afterEach() {
        // Clean up DOM
        this.table.remove();
    }
}, function() {

    QUnit.test('adding an item appends a row to the table', function(assert) {
        const item = { id: '101', name: 'Apple', price: 1.5 };

        // function that mirrors how the app creates a row
        function addItemRow(item) {
            const row = document.createElement('tr');
            row.innerHTML = `\n                <td>${item.id}</td>\n                <td>${item.name}</td>\n                <td>${item.price}</td>\n                <td><button data-id="${item.id}">Delete</button></td>\n            `;
            document.getElementById('items-body').appendChild(row);
        }

        assert.equal(this.tbody.children.length, 0, 'table starts empty');
        addItemRow(item);
        assert.equal(this.tbody.children.length, 1, 'table has one row after adding');
        const firstRowCells = this.tbody.children[0].querySelectorAll('td');
        assert.equal(firstRowCells[0].textContent.trim(), '101', 'id cell contains the item id');
        assert.equal(firstRowCells[1].textContent.trim(), 'Apple', 'name cell contains the item name');
        assert.equal(firstRowCells[2].textContent.trim(), '1.5', 'price cell contains the item price');
    });

    QUnit.test('removing an item deletes the correct row from the table', function(assert) {
        // add two rows
        const items = [
            { id: '201', name: 'Banana', price: 0.5 },
            { id: '202', name: 'Orange', price: 0.75 }
        ];

        function addItemRow(item) {
            const row = document.createElement('tr');
            row.innerHTML = `\n                <td>${item.id}</td>\n                <td>${item.name}</td>\n                <td>${item.price}</td>\n                <td><button data-id="${item.id}">Delete</button></td>\n            `;
            document.getElementById('items-body').appendChild(row);
        }

        function deleteItemRow(id) {
            const rows = Array.from(document.getElementById('items-body').children);
            for (const r of rows) {
                const cell = r.querySelector('td');
                if (cell && cell.textContent.trim() === id) {
                    r.remove();
                    return true;
                }
            }
            return false;
        }

        items.forEach(addItemRow);
        assert.equal(this.tbody.children.length, 2, 'two rows present after setup');

        const removed = deleteItemRow('201');
        assert.ok(removed, 'deleteItemRow returned true for existing id');
        assert.equal(this.tbody.children.length, 1, 'one row remains after deletion');
        // remaining row should be the one with id 202
        const remainingId = this.tbody.querySelector('td').textContent.trim();
        assert.equal(remainingId, '202', 'remaining row has the expected id');
    });

});
