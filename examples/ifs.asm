// A
LDR0 0 // y
SDR0 AY
LDR0 128 // x
SDR0 AX

// B
LDR0 255 // y
SDR0 BY
LDR0 0 // x
SDR0 BX

// C
LDR0 255 // y
SDR0 CY
LDR0 255 // x
SDR0 CX

// PT
42 // Undocumented instruction: R0 = random value
SDR0 PTY// y
42
SDR0 PTX // x

START:

42 // Which of A, B, or C?
LDR1 3
MOD

JZ DO_A // 0
DEC
JZ DO_B // 1
JMP DO_C // 2 (else)

DO_A:
// Ay / 2
LIR0 AY
LDR1 2
DIV
SDR0 TMP_Y

// Ax / 2
LIR0 AX
LDR1 2
DIV
SDR0 TMP_X

LDR0 9
SDR0 COLOR

JMP ENDIF

DO_B:
// By / 2
LIR0 BY
LDR1 2
DIV
SDR0 TMP_Y

// Bx / 2
LIR0 BX
LDR1 2
DIV
SDR0 TMP_X

LDR0 10
SDR0 COLOR

JMP ENDIF

DO_C:
// Cy / 2
LIR0 CY
LDR1 2
DIV
SDR0 TMP_Y

// Cx / 2
LIR0 CX
LDR1 2
DIV
SDR0 TMP_X

LDR0 11
SDR0 COLOR

ENDIF:

// HPT_Y = PTy / 2
LIR0 PTY
LDR1 2
DIV
SDR0 HPT_Y

// HPT_X = PTx / 2
LIR0 PTX
LDR1 2
DIV
SDR0 HPT_X

LIR0 TMP_Y
LIR1 HPT_Y
ADD

SDR0 PTY

LIR0 TMP_X
LIR1 HPT_X
ADD

SDR0 PTX

LIR1 PTY
LIR0 PTX

PLOT COLOR: 15

JMP START

HALT

AY: 0
AX: 0
BY: 0
BX: 0
CY: 0
CX: 0
PTY: 0
PTX: 0
TMP_Y: 0
TMP_X: 0
HPT_Y: 0
HPT_X: 0
