
export default {
    lisp: `(defun hello-world()
"Display the string hello world."
  (interactive)
  (message "hello world"))
`,

objectivec: `#include <stdio.h>
#include <objpak.h>
int
main (int argc, char **argv)
{
  id set =[Set new];
  argv++;
  while (--argc)
  [set add: [String str:*argv++]];
  [set
   do
  {
          printf("hello world")
   }
  ];
  return 0;
  }`
};
