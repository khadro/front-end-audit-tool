To test the JS and SCSS on a website use the following commands in a bash or bash-like shell (wsl for windows is the easiest):

### JavaScript

`yarn eslint [path to the js file to test]`

This will take the path, and run ESLint using our local configuration (rather than looking for one at the destination).

To try and fix as many issues with the JS as possible you can run

`yarn eslintfix "[path to the scss folder to test]"`

### SCSS

`yarn scsslint "[path to the scss folder to test]"`

Note the double quotes around the path+files paramater. This is critical for this command to run. This also must be an absolute path to the destination. A relative or shortcut path such as `~/sites/website/theme/scss` will not work.

To try and fix as many issues with the SCSS as possible you can run

`yarn scsslintfix "[path to the scss folder to test]"`

__Important:__ It is suggested that you do this for the first time in a new branch, in case something goes wrong. It's much easier to return to a branch than it is to try and undo thousands of file changes.


*Notes*
`@ronilaukkarinen/stylelint-a11y` is used as a replacement for `stylelint-a11y` as the latter has not been updated for three years and is now two major versions of `stylelint` out of date.
