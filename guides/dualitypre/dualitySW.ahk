#singleinstance
SetBatchLines 0
SetKeyDelay 0

\:: 

Send, ^z ; 3074UL
send {F1} ; inventory
sleep, 1200
MouseMove, 60, 700, 0 ; open loadouts
MouseClick
loop 40
{
MouseMove, 320, 1100, 0 ; loadout 11
MouseClick
MouseMove, 200, 1100, 0 ; loadout 12
MouseClick
}
Send, ^z ; 3074UL
Sleep, 300
MouseMove, 200, 1100, 0 ; end on left loadout (duality)
MouseClick
Sleep, 100
MouseClick
send, {\}
Send, {F1}