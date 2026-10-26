#SingleInstance Force
SetBatchLines 0
SetKeyDelay 0

; Safety changes:
;  - \ only works while Destiny 2 is the active window (so it can't click your desktop)
;  - Esc stops the macro mid-run
;  - the macro also stops by itself if you alt-tab away
; If your game exe isn't destiny2.exe, change it in both places: GAME below
; and the #IfWinActive line (AutoHotkey needs it written out there).
GAME := "ahk_exe destiny2.exe"
running := false

#IfWinActive ahk_exe destiny2.exe
$\::
    if (running)
        return
    running := true
    Macro()
    running := false
return
#IfWinActive

#If running
~Esc::
    running := false
return
#If

Macro() {
    if !Alive()
        return

    Send, ^z ; 3074UL
    send {F1} ; inventory
    Sleep, 1200
    if !Alive()
        return
    MouseMove, 60, 700, 0 ; open loadouts
    MouseClick

    loop 40
    {
        if !Alive()
            return
        MouseMove, 320, 1100, 0 ; loadout 11
        MouseClick
        MouseMove, 200, 1100, 0 ; loadout 12
        MouseClick
    }

    if !Alive()
        return
    Send, ^z ; 3074UL
    Sleep, 300
    MouseMove, 200, 1100, 0 ; end on left loadout (duality)
    MouseClick
    Sleep, 100
    MouseClick
    send, {\}
    Send, {F1}
}

Alive() {
    global running, GAME
    return running && WinActive(GAME)
}
