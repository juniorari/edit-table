# edit-table

A simple edit of a cell in a table

Use:
```
<td>Content of the cell</td>

```
and on script tag:

``` 
$('td').EditTable({
  beforeOpen: function($td, ev) {
   console.log($td.text())
   return true;
  },
  afterChange: function($td, oldVal, newVal) {
   console.log(oldVal, newVal)
  },
});

```
 
Options:
- classTd: String - The class name who will be added on td cell
- classInput: String - The class name who will be added on input created
- afterChange: Function - Action to be execute after input change
- beforeOpen: Function - Action to be execute/verify if have open or not to edit cell. Have return true to be able edit
- maxLength: String|Integer - Maxlength of input
- iconEdit: String - If present, will be show a icon on right of the input to indicate it is editing. To not show, pass empty value
- iconEditStyle: String - The stylesheet of icon showed. PS: Because different versions of FontAwesome, if necessary modify this parameter
 
 
 ![arjEditTable01](https://user-images.githubusercontent.com/14263768/59794253-8d0a4e00-92a6-11e9-8c83-9054100c8c94.png)

Editing table:

![arjEditTable02](https://user-images.githubusercontent.com/14263768/59794295-a7442c00-92a6-11e9-96c8-dee362948914.png)

 
### Bonus: setpointCursorPosition

Set cursor at point position

@param pos integer The position cursor will be positioned

```
$('element').setCursorPosition(pos)
```

## Todo
- [ ] Edit with radio, checkbox or select
- [ ] Edit with [Select2](https://select2.org/)


 
 Updated on Jun 2019
