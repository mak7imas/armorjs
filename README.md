# armorjs
javascript library for armor project

Эта маленькая библиотека предназначен для замены JQuery 
в проектах для мобильных устройств.
В отличии от JQuery библиотека расширяет возможности и дополняет новыми свойствами 
непосредственно DOM элементы.

Пример:

  A(".selector").ext(
    {
    params: {
     str: 'test'
    },
    
    init: function() {
     this.on("click", function(e) {
      alert(this.params.str);
     });
    },
   }
  );

Авторы проекта:
  Максим Андреев,
  Никлай Яремченко

