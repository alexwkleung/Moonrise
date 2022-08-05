# Title 1

## Title 2
 
### Title 3

#### Title 4 

##### Title 5 

###### title 6

# Basics 

All headings are underlined.

> This is a blockquote
> - Unordered list within a blockquote

- [x] Checked
- [ ] Not checked

1. One
2. Two
3. Three

**Bold**

*Italic*

# Tables 

| Title       | Description |
| ----------- | ----------- |
| Header      | Title       |
| Paragraph   | Text        |

<br>

| Hello          | World               |
|----------------|---------------------|
| Saturn         | Earth               |
| Pluto          | Moon                |

<br>

| Language              | Cool?     |            
|-----------------------|-----------|
| C++                   | Maybe     |
| JavaScript/TypeScript | Maybe     |

# Code block highlighting

**Code block highlighting using highlight.js:**

```ts
function test(): void {
  console.log("Hello");
}
test();
```

```cpp 
#include <iostream>

int main() {
  std::cout << "Hello" << '\n';

  return 0;
}
```

# KaTeX 

**KaTeX inline mode:**

```
$E=MC^2$
```

**KaTeX display mode:**

```
$$E=MC^2$$
```

**KaTeX mhchem extension:**

**Display mode**

```
$$\ce{ H2O }$$
```

**Inline mode**

```
$\ce{ [AgCl2]- }$
```

# Images 

1) You can load images locally.

- Local paths always start with `file:///users/<your user>/<path>`

```markdown
![](file:///users/alex/Desktop/Moonrise/Images/iris.png)
```
![](<file:///users/alex/Desktop/Git Repos/Moonrise/demo-files/Images/iris.png>)

2) You can also load images from a remote source.

If your path has a space, make sure you put angled brackets around your path

```markdown
![](<"path here (minus the strings)">)
```